import Conf from "conf";
import defaults from "./config.defaults.json";

export const config = new Conf({ projectName: "toogoodtogobot", defaults });

export const setEmail = (email: string) => {
    config.set("email", email);
};
