import { Command } from "./deps.ts";
import build from "./src/build.ts";

await new Command()
  .name("vale")
  .version("0.1.0")
  .global()
  .description(`Manage Vale projects`)
  .command("build", "Build the website")
  .action(async () => {
    console.log(await build(Deno.cwd()));
  }).parse(Deno.args);
