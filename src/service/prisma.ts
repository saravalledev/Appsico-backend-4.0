import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulidx';

const prisma = new PrismaClient().$extends({
  query: {
    $allModels: {
      async create({ args, query }) {
        args.data = {
          id: ulid(),
          ...args.data,
        };

        return query(args);
      },
    },
  },
});

export default prisma;
