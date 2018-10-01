import { Module } from '@nestjs/common';
import {RunnerController} from './runner.controller';

@Module({
    controllers: [
        RunnerController
    ]
})
export class RunnerModule {

}