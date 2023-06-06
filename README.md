> :warning: This repository has been archived! We've integrated this tool into our larger scale projects :D

![](https://edge.furret.codes/f/replit-token-scanner.png)

# Replit Token Scanner

A community-led project that aims to scan published Repls to find secrets and invalidate
them.

## Usage

This repo contains the scanner code and the website. The scanner runs on 1 minute intervals,
typically 45 seconds of task running and 15 seconds of downtime. A task fetchs recently
published Repls via [Replit's GraphQL API](https://replit.com/graphql), and then spawns a
child process which creates clients that connect to each of these Repls via [crosis4furrets](https://github.com/rayhanadev/crosis4furrets)
(an abstraction of [@replit/crosis](https://github.com/replit/crosis)).

Upon connection, the clients create a recursed directory (filtering out common directories such
as packages) and then reads every file. The files are [matched to regexs](https://github.com/l4yton/RegHex#github)
that find exposed secrets and tokens. The child process then communicates any Repls with tokens
to the task which then posts the tokens to the [dump repository](https://github.com/rayhanadev/Replit-Token-Dump)
from where Github handles invalidating tokens with their [Token Scanning Partners](https://github.blog/2019-08-19-github-token-scanning-one-billion-tokens-identified-and-five-new-partners/).

Although not recommended, you can create your own token scanning instance by cloning this
repository and a little bit of setup.

You will need:

-   a Replit Token (see [here](https://replit.com/talk/learn/How-to-Get-Your-SID-Cookie/145979))
-   a Github Personal Access Token
-   a Github repository to dump tokens

Clone this repository and add the follow secrets to your environment:

```env
REPLIT_TOKEN=

GITHUB_TOKEN=
GITHUB_OWNER=
GITHUB_REPO=
```

Once you complete that, you may run:

```sh
$ yarn install
$ yarn start
```

To start scanning tokens!

## Contributing

This project is in active development and we would love some :sparkles: fabulous
:sparkles: contributions! To get started, visit our [Contributing](https://github.com/rayhanadev/Replit-Token-Scanner/blob/main/CONTRIBUTING.md)
documentation.

## Licensing

This project is licensed under the MIT License. For more information, see [LICENSE](https://github.com/rayhanadev/Replit-Token-Scanner/blob/main/LICENSE).
