# prof.js

Profile a site by hitting it a bunch of times and getting min/mean/median/max TTFB and full load times.

# Usage

Install deps:

```
npm install
```

Run it:

```
Usage: prof ./prof.js -s http://google.com -c 10

  Profile a site

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -s, --site <h>   Site to profile
    -c, --count <c>  Number of requests
```

# License

MIT
