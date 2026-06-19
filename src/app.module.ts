import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { EventModule } from './modules/event/event.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PaymentModule } from './modules/payment/payment.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { RegionModule } from './modules/location/region/region.module';
import { DistrictModule } from './modules/location/district/district.module';
import { CommuneModule } from './modules/location/commune/commune.module';
import { QuarterModule } from './modules/location/quarter/quarter.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost/MADA-event:270017',
    ),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    AuthModule,
    UserModule,
    EventModule,
    PaymentModule,
    TicketModule,

    QuarterModule,
    CommuneModule,
    DistrictModule,
    RegionModule,
  ],
})
export class AppModule {}
