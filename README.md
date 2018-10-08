# oauth2orize-device-code

[OAuth2orize](https://github.com/jaredhanson/oauth2orize) extensions providing
support for [Device Flow for Browserless and Input Constrained Devices](https://tools.ietf.org/html/draft-ietf-oauth-device-flow-07).

This flow allows devices which lack an easy input method (such as a smart TV,
media console, picture frame, or printer) to request user authorization.
Authorization will be performed on a secondary device, such as a desktop
computer or smartphone, where a suitable input method and browser are available.

---

<p align="center"><a href="//pluralsight.pxf.io/c/1312135/448522/7490">Start a 10-day free trial at Pluralsight - Over 5,000 Courses Available</a></p>

---

Status:
[![Version](https://img.shields.io/npm/v/oauth2orize-device-code.svg?label=version)](https://www.npmjs.com/package/oauth2orize-device-code)
[![Build](https://img.shields.io/travis/jaredhanson/oauth2orize-device-code.svg)](https://travis-ci.org/jaredhanson/oauth2orize-device-code)
[![Quality](https://img.shields.io/codeclimate/github/jaredhanson/oauth2orize-device-code.svg?label=quality)](https://codeclimate.com/github/jaredhanson/oauth2orize-device-code)
[![Coverage](https://img.shields.io/coveralls/jaredhanson/oauth2orize-device-code.svg)](https://coveralls.io/r/jaredhanson/oauth2orize-device-code)
[![Dependencies](https://img.shields.io/david/jaredhanson/oauth2orize-device-code.svg)](https://david-dm.org/jaredhanson/oauth2orize-device-code)


## Install

```bash
$ npm install oauth2orize-device-code
```

## Considerations

#### Specification

This module is implemented based on [OAuth 2.0 Device Flow for Browserless and Input Constrained Devices](https://tools.ietf.org/html/draft-ietf-oauth-device-flow-07),
draft version 07.  As a draft, the specification remains a work-in-progress and
is *not* final.  The specification is under discussion within the [OAuth Working Group](https://datatracker.ietf.org/wg/oauth/about/)
of the [IETF](https://www.ietf.org/).  Implementers are encouraged to track the
progress of this specification and update implementations as necessary.
Furthermore, the implications of relying on non-final specifications should be
understood prior to deployment.

## Sponsorship

OAuth2orize is open source software.  Ongoing development is made possible by
generous contributions from [individuals and corporations](https://github.com/jaredhanson/oauth2orize/blob/master/SPONSORS.md).
To learn more about how you can help keep this project financially sustainable,
please visit Jared Hanson's page on [Patreon](https://www.patreon.com/jaredhanson).

## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2016-2018 Jared Hanson <[http://jaredhanson.net/](http://jaredhanson.net/)>
