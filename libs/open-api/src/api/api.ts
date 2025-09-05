export * from './locations.service';
import { LocationsService } from './locations.service';
export * from './parameters.service';
import { ParametersService } from './parameters.service';
export * from './sensors.service';
import { SensorsService } from './sensors.service';
export const APIS = [LocationsService, ParametersService, SensorsService];
