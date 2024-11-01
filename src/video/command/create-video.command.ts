import { ICommand } from '@nestjs/cqrs';

export class CreateVideoCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly title: string,
    public readonly mimetype: string,
    public readonly extension: string,
    public readonly buffer: Buffer,
  ) {}
}
