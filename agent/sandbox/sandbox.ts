import { defineSandbox } from "eve/sandbox";
import { VercelSandbox } from "eve/sandbox/vercel";

export const environment = VercelSandbox.environment({
  prepare: async (sandbox) => {
    const result = await sandbox.run({
      command: "sudo apt-get update && sudo apt-get install -y jq",
    });
    if (result.exitCode !== 0) throw new Error(result.stderr);
  },
});

export default defineSandbox(() => environment.open());