import { ApplicationConfig } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import {
  FeatureConfiguration,
  FeatureFlagsService,
  provideFrontFeatureFlags,
} from '@aplazo/front-feature-flags';
import { defer, lastValueFrom, map, switchMap, take, tap, timer } from 'rxjs';
import { environment } from '../environments/environment.development';
import { routes } from './app.routes';

export function initRootServices(
  featureFlagsService: FeatureFlagsService
): () => Promise<void> {
  return async () => {
    return await lastValueFrom(
      timer(150).pipe(
        take(1),
        map(() => ({ merchantId: '199' })),
        switchMap((user) =>
          defer(() =>
            featureFlagsService.startLoggedClient(user.merchantId)
          ).pipe(map(() => user))
        ),
        tap((user) => {
          featureFlagsService.setLoggedAttributes({
            merchantId: user.merchantId,
          });
        }),
        map(() => undefined)
      )
    );
  };
}
const settings: FeatureConfiguration = {
  authorizationKey: environment.STATISIG_API_KEY,
  env: environment.STATSIG_ENV,
  devMode: false,
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFrontFeatureFlags(settings)],
};
