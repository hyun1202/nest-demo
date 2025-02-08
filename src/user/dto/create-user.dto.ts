import { ApiProperty, ApiSchema } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  name?: string;
  @ApiProperty()
  email: string;
}
