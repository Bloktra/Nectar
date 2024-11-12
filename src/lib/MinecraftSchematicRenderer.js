import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { parse } from "prismarine-nbt";

class MinecraftSchematicRenderer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.textureAtlas = null;
    this.blockGeometry = this.createBlockGeometry();
    this.blockMaterials = new Map();
    this.textureLoader = new THREE.TextureLoader();

    // Block texture coordinates in the default resource pack
    this.blockTextureMap = {
      1: {
        // Stone
        all: [1, 0],
      },
      2: {
        // Grass Block
        top: [0, 0],
        side: [3, 0],
        bottom: [2, 0],
      },
      3: {
        // Dirt
        all: [2, 0],
      },
      4: {
        // Cobblestone
        all: [0, 1],
      },
      5: {
        // Oak Planks
        all: [4, 0],
      },
      12: {
        // Sand
        all: [2, 1],
      },
      17: {
        // Oak Log
        top: [5, 1],
        side: [4, 1],
        bottom: [5, 1],
      },
      18: {
        // Oak Leaves
        all: [4, 3],
      },
      // Add more block mappings as needed
    };

    this.setupRenderer();
    this.setupCamera();
    this.setupLights();
    this.setupControls();
  }

  setupRenderer() {
    this.renderer.setSize(
      this.container.clientWidth,
      this.container.clientHeight
    );
    this.renderer.setClearColor(0x87ceeb);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
  }

  setupCamera() {
    this.camera.position.set(10, 10, 10);
    this.camera.lookAt(0, 0, 0);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  createBlockGeometry() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Calculate UV coordinates for each face
    const uvAttribute = geometry.attributes.uv;
    const textureSize = 16; // Size of each texture in the atlas
    const atlasSize = 256; // Total atlas size

    // Function to calculate UVs for a texture position
    const calculateUVs = (x, y) => {
      const u1 = (x * textureSize) / atlasSize;
      const v1 = 1 - ((y + 1) * textureSize) / atlasSize;
      const u2 = ((x + 1) * textureSize) / atlasSize;
      const v2 = 1 - (y * textureSize) / atlasSize;
      return [u1, v1, u2, v1, u1, v2, u2, v2];
    };

    // Default UVs for all faces
    const defaultUVs = calculateUVs(0, 0);
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 8; j++) {
        uvAttribute.array[i * 8 + j] = defaultUVs[j];
      }
    }

    return geometry;
  }

  async loadTextureAtlas() {
    return new Promise((resolve, reject) => {
      this.textureLoader.load(
        "terrain.png",
        (texture) => {
          texture.magFilter = THREE.NearestFilter;
          texture.minFilter = THREE.NearestFilter;
          this.textureAtlas = texture;
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  }

  createBlockMaterial(blockId, blockData) {
    const textureInfo = this.blockTextureMap[blockId];
    if (!textureInfo)
      return new THREE.MeshPhongMaterial({
        color: this.getDefaultBlockColor(blockId),
      });

    const materials = [];
    const faces = ["right", "left", "top", "bottom", "front", "back"];

    faces.forEach((face) => {
      const material = new THREE.MeshPhongMaterial({ map: this.textureAtlas });

      // Get texture coordinates based on face
      let texCoords;
      if (textureInfo.all) {
        texCoords = textureInfo.all;
      } else if (face === "top" && textureInfo.top) {
        texCoords = textureInfo.top;
      } else if (face === "bottom" && textureInfo.bottom) {
        texCoords = textureInfo.bottom;
      } else if (textureInfo.side) {
        texCoords = textureInfo.side;
      } else {
        texCoords = [0, 0]; // Default texture coordinates
      }

      // Clone geometry for this face and update UVs
      const faceGeometry = this.blockGeometry.clone();
      const uvAttribute = faceGeometry.attributes.uv;
      const textureSize = 16;
      const atlasSize = 256;

      const u1 = (texCoords[0] * textureSize) / atlasSize;
      const v1 = 1 - ((texCoords[1] + 1) * textureSize) / atlasSize;
      const u2 = ((texCoords[0] + 1) * textureSize) / atlasSize;
      const v2 = 1 - (texCoords[1] * textureSize) / atlasSize;

      const uvs = [u1, v1, u2, v1, u1, v2, u2, v2];
      for (let i = 0; i < 8; i++) {
        uvAttribute.array[i] = uvs[i];
      }

      material.userData = { face, geometry: faceGeometry };
      materials.push(material);
    });

    return materials;
  }

  async renderBlock(x, y, z, blockId, blockData) {
    if (!this.blockMaterials.has(blockId)) {
      const materials = this.createBlockMaterial(blockId, blockData);
      this.blockMaterials.set(blockId, materials);
    }

    const materials = this.blockMaterials.get(blockId);
    if (Array.isArray(materials)) {
      materials.forEach((material, index) => {
        const geometry = material.userData.geometry;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, z);

        if (blockData > 0) {
          this.rotateBlock(mesh, blockData);
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;
        this.scene.add(mesh);
      });
    } else {
      const mesh = new THREE.Mesh(this.blockGeometry, materials);
      mesh.position.set(x, y, z);

      if (blockData > 0) {
        this.rotateBlock(mesh, blockData);
      }

      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.scene.add(mesh);
    }
  }

  async loadSchematic(schematicData) {
    await this.loadTextureAtlas();

    try {
      // Convert ArrayBuffer to Uint8Array for prismarine-nbt
      const dataView = new Uint8Array(schematicData);

      // Create a browser-compatible buffer-like object
      const buffer = {
        buffer: dataView,
        offset: 0,
        length: dataView.length,
        slice: function (start, end) {
          return new Uint8Array(this.buffer.slice(start, end));
        },
      };

      // Parse the NBT data using prismarine-nbt
      const { parsed: nbtData } = await parse(buffer);

      const width = nbtData.value.Width.value;
      const height = nbtData.value.Height.value;
      const length = nbtData.value.Length.value;

      // Convert TypedArrays to regular arrays if needed
      const blocks = Array.from(nbtData.value.Blocks.value);
      const data = Array.from(nbtData.value.Data.value);

      this.clearScene();

      for (let y = 0; y < height; y++) {
        for (let z = 0; z < length; z++) {
          for (let x = 0; x < width; x++) {
            const index = y * width * length + z * width + x;
            const blockId = blocks[index];
            const blockData = data[index];

            if (blockId !== 0) {
              // Skip air blocks
              await this.renderBlock(x, y, z, blockId, blockData);
            }
          }
        }
      }

      this.centerCamera(width, height, length);
    } catch (error) {
      console.error("Error parsing schematic:", error);
      throw error;
    }
  }

  rotateBlock(mesh, blockData) {
    switch (blockData) {
      case 1:
        mesh.rotation.y = Math.PI / 2;
        break;
      case 2:
        mesh.rotation.y = Math.PI;
        break;
      case 3:
        mesh.rotation.y = -Math.PI / 2;
        break;
      case 4:
        mesh.rotation.x = Math.PI / 2;
        break;
      case 5:
        mesh.rotation.x = -Math.PI / 2;
        break;
    }
  }

  getDefaultBlockColor(blockId) {
    const colors = {
      1: 0x808080, // Stone
      2: 0x00ff00, // Grass
      3: 0x8b4513, // Dirt
      4: 0x636363, // Cobblestone
      5: 0x8b7355, // Wooden Planks
    };
    return colors[blockId] || 0xff00ff;
  }

  centerCamera(width, height, length) {
    const center = new THREE.Vector3(width / 2, height / 2, length / 2);
    this.controls.target.copy(center);
    this.camera.position.set(
      center.x + width,
      center.y + height,
      center.z + length
    );
    this.controls.update();
  }

  clearScene() {
    while (this.scene.children.length > 0) {
      const object = this.scene.children[0];
      if (object instanceof THREE.Light) {
        this.scene.children.shift();
      } else {
        this.scene.remove(object);
      }
    }
    this.setupLights();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy() {
    this.renderer.dispose();
    this.blockMaterials.clear();
    this.controls.dispose();
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
  }
}

export { MinecraftSchematicRenderer };
