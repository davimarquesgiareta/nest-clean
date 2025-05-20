import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcryptjs';

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'User with same e-mail address already exists.',
      );
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        email,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        password: hashedPassword,
      },
    });
  }
}
