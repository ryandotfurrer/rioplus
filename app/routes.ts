import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"), 
    route("about", "routes/about.tsx"), 
    route("mythic-plus", "routes/mythic-plus.tsx"),
    route("character/:region/:realm/:name", "routes/character.tsx")
] satisfies RouteConfig;
