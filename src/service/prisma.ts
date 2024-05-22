import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulidx';

const prisma = new PrismaClient().$extends({
	query: {
		$allModels: {
			async create({ args, query }) {
				args.data = {
					...args.data,
					id: ulid(),
				};

				return query(args);
			},
		},
	},
});

export default prisma;