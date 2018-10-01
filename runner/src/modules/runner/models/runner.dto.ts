import { IsString } from 'class-validator';

export class RunnerDto {
    @IsString()
    readonly code: string;

    @IsString()
    readonly language: string;
}