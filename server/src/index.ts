import "dotenv/config";
import app from "./app";
import { appConfig } from "./config/app.config";

const PORT = appConfig.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server is running on ${appConfig.NODE_ENV} mode at http://localhost:${PORT}`,
  );
});
