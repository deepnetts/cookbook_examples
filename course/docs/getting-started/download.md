# Download

To run Deep Netts applications, download the Deep Netts distribution used by the examples. You can read this course online without cloning its source repository.

## Choose the compatible distribution

The runnable projects linked by this course currently require these Maven artifacts:

```text
com.deepnetts:deepnetts-core-pro:4.0.0-beta
com.deepnetts:deepnetts-license:1.0
```

Download Deep Netts through the [official Deep Netts download page](https://www.deepnetts.com/checkout/). Use the distribution and license provided for your Deep Netts account or organization.

[Deep Netts Community Edition](https://www.deepnetts.com/deep-netts-community-edition/) is available separately from Maven Central, but it uses the `deepnetts-core` artifact. The course projects use `deepnetts-core-pro` and are not currently configured as Community Edition projects. Do not substitute one artifact for the other and assume the code will work unchanged.

## Before continuing

Make sure you have:

- the downloaded Deep Netts distribution that provides `deepnetts-core-pro:4.0.0-beta`;
- the corresponding Deep Netts license supplied for your account or organization;
- access to the import script included with that distribution.

Keep the downloaded distribution and license in a secure local location. Do not add license files, account credentials, or downloaded proprietary libraries to source control.

Installation makes the downloaded Deep Netts artifacts available to Maven and configures the required Java runtime options. You will download a runnable project later, when you are ready to verify the installation with Hello World or explore a complete example.
