export default {
    fetch(req: Request) {
        const url = new URL(req.url);

        if (url.pathname === '/oauth/callback') {
            return new Response("OAuth success.")
        }

        return new Response("Not found", { status: 404 })
    }
}