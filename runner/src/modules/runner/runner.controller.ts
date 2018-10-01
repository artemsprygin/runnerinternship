import {Body, Controller, Get, Post, UsePipes} from '@nestjs/common';
import {RunnerDto} from './models/runner.dto';
import { Runner } from './runner';

@Controller('run')
export class RunnerController {

    @Post()
    root(@Body() runnerDto: RunnerDto) {
        return Runner.run(runnerDto.language,runnerDto.code);
    }
}
