import { Global, Module } from '@nestjs/common';
import { ConfigModule as ConfigModuleBase } from '@nestjs/config';
import { ConfigService } from './config.service';

@Global()
@Module({
  imports: [ConfigModuleBase.forRoot({ isGlobal: true })],
  providers: [ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
