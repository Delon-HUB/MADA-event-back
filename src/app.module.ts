import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { DistrictModule } from './modules/localisation/district/district.module';
import { RegionModule } from './modules/localisation/region/region.module';
import { ProvinceModule } from './modules/localisation/province/province.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/MADA-event:270017',
    ),
    AuthModule,
    UserModule,
    ProvinceModule,
    RegionModule,
    DistrictModule,
  ],
})
export class AppModule {}
