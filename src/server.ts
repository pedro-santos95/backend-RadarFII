import { env } from "./config/env";
import { app } from "./app";

app.listen(env.PORT, () => {
  // Keep startup log explicit for container logs and local dev.
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${env.PORT}`);
});
