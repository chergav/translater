export function generateUniqueEmail(): string {
	const uuid = crypto.randomUUID();
	const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com'];
	const domain = domains[Math.floor(Math.random() * domains.length)];

	return `user-${uuid}@${domain}`;
}
