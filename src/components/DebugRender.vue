<template>
  <div class="">
    <input type="file" accept=".schematic,.nbt" @change="handleFileUpload" />
    <div class="stats" v-if="structureInfo">
      <p>
        Size: {{ structureInfo.width }} x {{ structureInfo.height }} x
        {{ structureInfo.length }}
      </p>
      <p>Block Count: {{ structureInfo.blockCount }}</p>
    </div>
    <div ref="container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import * as SchemJS from "@enginehub/schematicjs";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  NbtFile,
  Identifier,
  ItemStack,
  BlockModel,
  BlockDefinition,
} from "deepslate";

const container = ref(null);
const structureInfo = ref(null);
const sceneReady = ref(false);
let scene, camera, renderer, controls;

// Block color mapping
const blockColors = {
  // Stone variants
  "1:0": "#787878", // Stone
  "1:1": "#B4B4B4", // Granite
  "1:2": "#DBD3C6", // Polished Granite
  "1:3": "#C1C1C1", // Diorite
  "1:4": "#E3E3E5", // Polished Diorite
  "1:5": "#97908A", // Andesite
  "1:6": "#8C8C8C", // Polished Andesite

  // Dirt variants
  "3:0": "#8B4513", // Dirt
  "3:1": "#8B4513", // Coarse Dirt
  "3:2": "#8B4513", // Podzol

  // Common building blocks
  "4:0": "#808080", // Cobblestone
  "5:0": "#DEB887", // Oak Planks
  "17:0": "#6B511F", // Oak Log
  "17:1": "#2E1506", // Spruce Log
  "17:2": "#BCB174", // Birch Log

  // Nature blocks
  "2:0": "#228B22", // Grass
  "18:0": "#00AA00", // Oak Leaves
  "18:1": "#008800", // Spruce Leaves
  "18:2": "#00AA00", // Birch Leaves

  // Default fallback
  default: "#8b3333",
};

// Create geometry with separate faces
const createBlockGeometry = () => {
  const geometry = new THREE.BufferGeometry();

  // Vertex positions for a unit cube
  const vertices = new Float32Array([
    // Front face
    -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5, 0.5,
    // Back face
    -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, -0.5,
    // Top face
    -0.5, 0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5,
    // Bottom face
    -0.5, -0.5, -0.5, 0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5,
    // Right face
    0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, 0.5, 0.5, 0.5, -0.5, 0.5,
    // Left face
    -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5,
  ]);

  // Indices for each face
  const indices = new Uint16Array([
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ]);

  geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
};

const createGrid = () => {
  const size = 100;
  const divisions = 100;
  const gridHelper = new THREE.GridHelper(size, divisions, 0x666666, 0x444444);
  return gridHelper;
};

const initScene = () => {
  if (!container.value) return;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  // Add fog
  scene.fog = new THREE.Fog(0x87ceeb, 50, 300);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(15, 15, 15);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxDistance = 100;
  controls.minDistance = 2;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(50, 50, 50);
  directionalLight.castShadow = true;
  // Improve shadow quality
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  scene.add(directionalLight);

  // Add ground grid
  const grid = createGrid();
  scene.add(grid);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  window.addEventListener("resize", onWindowResize);
  sceneReady.value = true;
  animate();
};

const shouldRenderFace = (x, y, z, face, blocks, width, height, length) => {
  let checkX = x,
    checkY = y,
    checkZ = z;

  switch (face) {
    case "front":
      checkZ++;
      break;
    case "back":
      checkZ--;
      break;
    case "top":
      checkY++;
      break;
    case "bottom":
      checkY--;
      break;
    case "right":
      checkX++;
      break;
    case "left":
      checkX--;
      break;
  }

  // Check if the adjacent block position is valid
  if (
    checkX < 0 ||
    checkX >= width ||
    checkY < 0 ||
    checkY >= height ||
    checkZ < 0 ||
    checkZ >= length
  ) {
    return true;
  }

  // Get the adjacent block
  const index = checkY * width * length + checkZ * width + checkX;
  const adjacentBlock = blocks[index];

  // Render the face if the adjacent block is air (0)
  return adjacentBlock === 0 || adjacentBlock?.toString() === "0b";
};

const createInstancedMesh = (geometry, material, count) => {
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};

const handleFileUpload = async (event) => {
  if (!sceneReady.value) {
    console.error("Scene not ready");
    return;
  }

  const file = event.target.files[0];
  if (!file) return;

  try {
    const arrayBuffer = await file.arrayBuffer();
    const nbtFile = NbtFile.read(new Uint8Array(arrayBuffer));

    let type = undefined;

    clearScene();

    const schematicData = nbtFile.root;
    console.log("Schematic data:", schematicData);
    console.log("nbtFile:", nbtFile);
    const width = schematicData.getNumber("Width") ?? 0;
    const height = schematicData.getNumber("Height") ?? 0;
    const length = schematicData.getNumber("Length") ?? 0;

    const blocksTag = schematicData.get("BlockData");
    const Metadata = schematicData.get("Metadata");
    const DataVersion = schematicData.get("DataVersion");
    const PaletteData = schematicData.get("Palette");
    console.log("Metadata:", Metadata);
    console.log("DataVersion:", DataVersion.value);
    if (!blocksTag || !blocksTag.items) {
      console.error("No blocks data found in schematic");
      return;
    }

    const blocks = Array.from(blocksTag.items);

    // Create block instances by material color
    const blocksByColor = new Map();
    let visibleBlockCount = 0;

    // First pass: Count blocks by color for instancing
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < length; z++) {
        for (let x = 0; x < width; x++) {
          const index = y * width * length + z * width + x;
          const blockId = blocks[index].value;

          if (blockId === 0) continue;
          //console.log("Block ID:", blockId);

          const color = blockColors[blockId] || 0x8b3333;
          if (!blocksByColor.has(color)) {
            blocksByColor.set(color, []);
          }
          blocksByColor.get(color).push({ x, y, z });
          visibleBlockCount++;
        }
      }
    }

    // Create optimized geometry with face culling
    const baseGeometry = createBlockGeometry();

    // Create instanced meshes for each color
    blocksByColor.forEach((positions, color) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.2,
      });

      const instancedMesh = createInstancedMesh(
        baseGeometry,
        material,
        positions.length
      );
      const matrix = new THREE.Matrix4();

      positions.forEach((pos, i) => {
        matrix.setPosition(pos.x - width / 2, pos.y, pos.z - length / 2);
        instancedMesh.setMatrixAt(i, matrix);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      scene.add(instancedMesh);
    });

    // Update structure info
    structureInfo.value = {
      width,
      height,
      length,
      blockCount: visibleBlockCount,
    };

    // Adjust camera
    const maxDim = Math.max(width, height, length);
    camera.position.set(maxDim * 1.5, maxDim * 1.5, maxDim * 1.5);
    controls.target.set(0, height / 2, 0);
    controls.update();
  } catch (error) {
    console.error("Error loading schematic:", error);
  }
};

const clearScene = () => {
  if (!scene) return;

  scene.traverse((object) => {
    if (object instanceof THREE.InstancedMesh) {
      object.geometry.dispose();
      object.material.dispose();
      scene.remove(object);
    }
  });
};

const onWindowResize = () => {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};

const animate = () => {
  if (!renderer || !scene || !camera) return;
  requestAnimationFrame(animate);
  controls?.update();
  renderer.render(scene, camera);
};

onMounted(() => {
  initScene();
});

onUnmounted(() => {
  clearScene();
  renderer?.dispose();
  controls?.dispose();
  window.removeEventListener("resize", onWindowResize);
});
</script>

<style scoped>
.stats {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  border-radius: 5px;
  z-index: 100;
}
</style>
