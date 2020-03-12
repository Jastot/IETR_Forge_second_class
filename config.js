// Autodesk Forge configuration
module.exports = {
    // Set environment variables or hard-code here
    credentials: {
		client_id: "t8D7XVJvDCeCuLWySZfEiiH5eVTGtJbO",
        client_secret: "qNhADovf1lhQN74C",
        callback_url: "http://localhost:3000/api/forge/callback/oauth"
    },
    scopes: {
        // Required scopes for the server-side application
        internal: ['bucket:create', 'bucket:read', 'bucket:delete', 'data:read', 'data:create', 'data:write'],
        // Required scope for the client-side viewer
        public: ['viewables:read']
    }
};
