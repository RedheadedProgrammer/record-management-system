const SECRET = process.env.JWT_SECRET || (
	process.env.NODE_ENV === 'production'
		? undefined
		: 'local-development-secret-change-before-deploying'
);

if (!SECRET) {
	throw new Error('JWT_SECRET must be set in production.');
}

module.exports = { SECRET };
