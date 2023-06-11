# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.1](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v2.3.0...v2.3.1) (2023-06-11)

### Bug Fixes

- **collections/Guests:** update email generation logic ([acd2394](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/acd2394be0423347ea37a86361b6dc15bea5a345))

## [2.3.0](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v2.2.1...v2.3.0) (2023-06-10)

### Features

- **collection/Guests:** auto update email based on first, middle, and last name ([02e30e6](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/02e30e6e6af40264d2294aefa711903fd5da6d24))
- **collections/Guests:** limit access to admin, self, or party ([47ff99c](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/47ff99c41425faa7275b70253b370e94af8d3e12))
- **components/GuestList:** add color grouping by party ([0b5d793](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/0b5d7934a0a792728ba3d0a856527ef6d7c5a117))

### Bug Fixes

- **collections/Parties:** add limit to local API ([df1a963](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/df1a963d5e619501cc7a2454140f5bca7c8b43fd))

## [2.2.1](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v2.2.0...v2.2.1) (2023-06-01)

### Bug Fixes

- **components/GuestList:** prevent cell editing from completing with shift+enter ([2a54a04](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/2a54a04df9b319562e95d06958c3c8c995650f8e))
- **Guests/GuestList:** properly set sort index and reorder documents ([1401464](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/1401464a16607b3cbecc7cd65afdf572b0d2b084))

## [2.2.0](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v2.1.0...v2.2.0) (2023-05-31)

### Features

- **components/GuestList:** add ability to insert guest after/before any row ([9cea44b](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/9cea44bf2a10ed15680b2afec7b14e2354820d14))
- **components:** add TextareaEditor ([7c00c8a](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/7c00c8a8a15da97d5f1249670425ca3286d250bf))

### Bug Fixes

- **collections/Guests:** update reorder functionality ([39882ec](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/39882ec9da820d8d35ac4d72dd607ea4406dbaa5))
- **styles:** update variables, fix small issues ([bae5033](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/bae5033932e9bc5db45cb2f3c527779dc83ff4a5))

## [2.1.0](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v2.0.0...v2.1.0) (2023-05-25)

### Features

- **components:** add EditMany, add DeleteMany, update GuestList ([b400411](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/b400411eda715b9a66ce02ef97e4cb94208e5d1f))
- **config:** add PAYLOAD_DOMAIN to csrf ([c29616e](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/c29616e18240e0aca15c38e1c6f2fc2c71b6264c))

### Bug Fixes

- **collections:** update admin config ([57126c2](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/57126c2c25d8fe042cabe25044d116175d4770ae))
- **styles:** remove height ([04e2802](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/04e28020f7f0f72134865dc5e14602f980ba9897))

## [2.0.0](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v1.0.1...v2.0.0) (2023-05-24)

### Features

- **collections/Guests:** add custom data grid ([f028936](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/f028936ecc7390a4395ddc804d3d0b243a94ec72))
- **collections/User:** add roles field ([af32336](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/af323364767b589edd3de4ce7617afb1466022b3))
- **collections:** add Guests, Parties, Relations, Sides, Tags ([4b70f85](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/4b70f851a7c4372ac58dcb868ee49d9b58a2cc81))
- **config:** add csrf and serverUrl ([fd37c7c](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/fd37c7c969128534bf98bfefc995a8737d515390))
- **config:** add custom styles ([72d074d](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/72d074d193d22aef82cebb5c2c39c2acff60191c))

## [1.0.1](https://github.com/hjbugajski/jesse-and-henry-payload-cms/compare/v1.0.0...v1.0.1) (2023-05-18)

### Bug Fixes

- update access controls ([15f8607](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/15f8607821324ecb998700a5f973d7cdcb5771f4))

## 1.0.0 (2023-05-01)

### Features

- **access:** add access functions ([26918ce](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/26918ce3ad9ac67752de7a12006ebbad68747854))
- **blocks:** add Content ([dcf09ca](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/dcf09ca96c2141f5a8e64e0748e4589cb4eebfd8))
- **blocks:** add HeroTitle ([3e2df16](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/3e2df16ef902bc8b6c26093788f419a380d38270))
- **collections:** add Pages ([224fb8d](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/224fb8dc65679edca41564ffff120e7a17715612))
- **collections:** update User ([f796bec](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/f796bec40bdb1421733aeec36c65d3be7b4c5d0b))
- create project using create-payload-app ([564b938](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/564b93865ae3f118f06be0f475a4e530a3fe5527))
- generate payload types ([6ca2a84](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/6ca2a8488ffb291f337f2ff34492423a1ebe5ff4))
- **hooks:** add useSlug ([189cf07](https://github.com/hjbugajski/jesse-and-henry-payload-cms/commit/189cf078c389badcd8f0c29d1f5f267b53773e96))
