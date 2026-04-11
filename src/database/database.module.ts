import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
   imports: [
      TypeOrmModule.forRootAsync({
         imports: [ConfigModule],
         useFactory: (configService: ConfigService) => ({
            type: 'mongodb',
            url: configService.get<string>('DATABASE_URL'),
            synchronize: true,
            autoLoadEntities: true,
         }),
         inject: [ConfigService],
      }),
   ],
})
export class DatabaseModule {}
