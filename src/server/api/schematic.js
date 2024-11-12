import { Schematic } from "prismarine-schematic";
import fs from "fs";
import path from "path";

export default defineEventHandler(async (event) => {
  const filePath = path.resolve("./src/public/Guard150.schem"); // Adjust path as necessary

  try {
    // Read the schematic file
    const schematicBuffer = await fs.promises.readFile(filePath);
    const schematic = await Schematic.read(schematicBuffer, "1.16.4");

    return {
      size: schematic.size,
      offset: schematic.offset,
      palette: schematic.palette,
      blocks: schematic.blocks,
    };
  } catch (error) {
    return {
      status: "error",
      message: error.message,
    };
  }
});
