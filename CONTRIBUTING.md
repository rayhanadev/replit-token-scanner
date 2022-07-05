# Contributing

> Hey there, we're glad you want to contribute to Crosis4Furrets! To make sure things run
> smoothly, please read this documentation completely. Thank you, and we look forward to
> your contribution.

When contributing to this repository, please first discuss the change you wish to make
via issue, email, or any other method with the owners of this repository before making
a change.

Please note the following:

-   We have a [Code of Conduct](https://github.com/rayhanadev/Replit-Token-Scanner/blob/main/CODE_OF_CONDUCT.md),
    please follow it in all your interactions with the project.
-   We use `Eslint` and `Prettier` to lint and format our code respectively. We have
    included scripts and configuration files to help you maintain similar code:
    ```sh
    $ yarn lint:fix
    $ yarn format:fix
    ```
    please run these before building.
-   We use `Rollup` to bundle our ESM code to ESM and CommonJS compatible
    distributions, as well as generate Typescript types. We have included scripts and
    configuration files to help you build similar code:
    ```sh
    $ yarn build
    ```
    please run this before submitting a pull request.
-   We use `Jest` to test our distributions. We have included scripts and configuration files to
    help you run similar tests.
    ```sh
    $ yarn test
    ```
    please run this before submitting a pull request.
-   We follow the 'Conventional Commits' commit convention. If your pull request does
    not adhere to the convention, it will not be merged.

## Pull Request Process

1. Complete a quick code review for your code, you might catch any errors before you
   submit.
2. Make sure your pull request uses the most recent version of the code.
3. Ensure any dependencies match with current dependencies or have essential
   dependencies.
4. Update the README.md with changes if necessary. This includes any major changes to
   the features, usage of the package, etc.
5. Increase the version numbers in any examples files and the README.md to the new
   version that this Pull Request would represent. The versioning scheme we use is [SemVer](http://semver.org/).
6. You may merge the Pull Request in once you have the approval of repository
   maintainer or owner, or if you do not have permission to do that, you may request a
   reviewer to merge it for you.
