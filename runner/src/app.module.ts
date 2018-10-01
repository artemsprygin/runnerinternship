import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {RunnerModule} from './modules/runner/runner.module';

@Module({
  imports: [RunnerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
