import { Route as rootRoute } from './routes/__root';
declare const UsernameLazyImport: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/username", "/username", "/username", "/username", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
declare const LoginLazyImport: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/login", "/login", "/login", "/login", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
declare const IndexLazyImport: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/", "/", "/", "/", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
declare module '@tanstack/react-router' {
    interface FileRoutesByPath {
        '/': {
            id: '/';
            path: '/';
            fullPath: '/';
            preLoaderRoute: typeof IndexLazyImport;
            parentRoute: typeof rootRoute;
        };
        '/login': {
            id: '/login';
            path: '/login';
            fullPath: '/login';
            preLoaderRoute: typeof LoginLazyImport;
            parentRoute: typeof rootRoute;
        };
        '/username': {
            id: '/username';
            path: '/username';
            fullPath: '/username';
            preLoaderRoute: typeof UsernameLazyImport;
            parentRoute: typeof rootRoute;
        };
    }
}
export declare const routeTree: import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, {
    readonly IndexLazyRoute: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/", "/", "/", "/", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
    readonly LoginLazyRoute: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/login", "/login", "/login", "/login", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
    readonly UsernameLazyRoute: import("@tanstack/react-router").Route<import("@tanstack/react-router").RootRoute<{}, {}, {}, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, {}, unknown>, "/username", "/username", "/username", "/username", Record<string, unknown>, {}, {}, {}, {}, Record<never, string>, Record<never, string>, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, import("@tanstack/react-router").RouteContext, {}, {}, {}, unknown>;
}>;
export {};
