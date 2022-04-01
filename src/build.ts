import { join, walk } from "../deps.ts";

interface ValePage {
  name: string;
  path: string;
}

const getValeConfigFile = async (srcPath: string) => {
  try {
    const configFileContent = await Deno.readTextFile(
      join(srcPath, "vale.config.json"),
    );
    return configFileContent;
  } catch (_error) {
    return undefined;
  }
};

const getValePages = async (contentPath: string) => {
  const pages: Array<ValePage> = [];

  for await (const entry of walk(contentPath)) {
    if (entry.isFile) {
      pages.push({
        name: entry.name,
        path: entry.path.replace(contentPath, ""),
      });
    }
  }

  return pages;
};

export default async function build(
  srcPath: string,
) {
  const valeConfigFile = await getValeConfigFile(srcPath);

  if (valeConfigFile !== undefined) {
    const valeConfig = JSON.parse(valeConfigFile);
    const distFolderName = valeConfig.distFolder || "dist";

    const distPath = join(srcPath, distFolderName);
    const contentPath = join(srcPath, "content");

    // Create dist folder
    await Deno.mkdir(distPath, { recursive: true });

    console.log(await getValePages(contentPath));

    return "Built successfully!";
  } else {
    return "This is not a valid project, vale.config.json not exist!";
  }
}
