import { execSync } from "child_process";
import { relative } from "path";

export function remarkModifiedTime() {
  return function (_tree, file) {
    const filepath = file.history[0];

    const gitRoot = execSync("git rev-parse --show-toplevel", {
      encoding: "utf8",
    }).trim();

    const relativeFilePath = relative(gitRoot, filepath);

    try {
      // Get the last commit date for this specific file
      const result = execSync(
        `git log -1 --format="%cI" -- "${relativeFilePath}"`,
        {
          encoding: "utf8",
          cwd: gitRoot,
        },
      ).trim();

      if (result) {
        file.data.astro.frontmatter.lastModifiedDate = result;
      } else {
        const creationDate = execSync(
          `git log --reverse --format="%cI" -- "${relativeFilePath}" | head -1`,
          {
            encoding: "utf8",
            cwd: gitRoot,
          },
        ).trim();
        file.data.astro.frontmatter.lastModifiedDate =
          creationDate || new Date().toISOString();
      }
    } catch (error) {
      console.warn(
        `Failed to get git history for ${relativeFilePath}:`,
        error.message,
      );
      file.data.astro.frontmatter.lastModifiedDate = new Date().toISOString();
    }
  };
}
