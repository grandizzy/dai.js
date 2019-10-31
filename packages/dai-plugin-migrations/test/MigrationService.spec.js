import { migrationMaker } from './helpers';
import { mockCdpIds } from './helpers/mocks';
import { ServiceRoles, Migrations } from '../src/constants';
import SingleToMultiCdp from '../src/migrations/SingleToMultiCdp';
import SDaiToMDai from '../src/migrations/SDaiToMDai';
import GlobalSettlementSavingsDai from '../src/migrations/GlobalSettlementSavingsDai';
import GlobalSettlementCollateralClaims from '../src/migrations/GlobalSettlementCollateralClaims';
import GlobalSettlementDaiRedeemer from '../src/migrations/GlobalSettlementDaiRedeemer';
import MkrRedeemer from '../src/migrations/MkrRedeemer';

let maker, service;

beforeAll(async () => {
  maker = await migrationMaker();
  service = maker.service(ServiceRoles.MIGRATION);
});

test('can fetch a list of all migrations', () => {
  const ids = service.getAllMigrationsIds();

  expect(ids).toEqual(
    expect.arrayContaining([
      Migrations.SINGLE_TO_MULTI_CDP,
      Migrations.SDAI_TO_MDAI,
      Migrations.GLOBAL_SETTLEMENT_SAVINGS_DAI,
      Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS,
      Migrations.GLOBAL_SETTLEMENT_DAI_REDEEMER,
      Migrations.MKR_REDEEMER
    ])
  );
  expect(ids.length).toEqual(6);
});

test('getting each migration returns a valid migration', () => {
  expect(service.getMigration(Migrations.SINGLE_TO_MULTI_CDP)).toBeInstanceOf(
    SingleToMultiCdp
  );
  expect(service.getMigration(Migrations.SDAI_TO_MDAI)).toBeInstanceOf(
    SDaiToMDai
  );
  expect(
    service.getMigration(Migrations.GLOBAL_SETTLEMENT_SAVINGS_DAI)
  ).toBeInstanceOf(GlobalSettlementSavingsDai);
  expect(
    service.getMigration(Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS)
  ).toBeInstanceOf(GlobalSettlementCollateralClaims);
  expect(
    service.getMigration(Migrations.GLOBAL_SETTLEMENT_DAI_REDEEMER)
  ).toBeInstanceOf(GlobalSettlementDaiRedeemer);
  expect(service.getMigration(Migrations.MKR_REDEEMER)).toBeInstanceOf(
    MkrRedeemer
  );
});

test('getting a non-existent migration returns undefined', () => {
  expect(service.getMigration('non-existent')).toBeUndefined();
});

test('runAllChecks', async () => {
  mockCdpIds(maker);
  const result = await service.runAllChecks();
  expect(result).toEqual({
    [Migrations.SDAI_TO_MDAI]: expect.anything(),
    [Migrations.SINGLE_TO_MULTI_CDP]: {}
  });
  expect(result[Migrations.SDAI_TO_MDAI].eq(0)).toBeTruthy();
});
