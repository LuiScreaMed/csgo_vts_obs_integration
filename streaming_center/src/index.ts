import StreamingCenter from "./streaming_center.js";
import config from "./configs/connection_properties.js";

const center: StreamingCenter = new StreamingCenter(config);

center.start();