Version Control
===============

Our repository holds a number of different web apps with a shared codebase.  This is architected so that apps can be released individually, or together. All our code is managed via our central GitHub repository.

Feature Branches
----------------

Any feature additions, and any non-trivial bug fixes, should be created as branches off of `master`.  They should be named things like "feature-feed-management", or "bug-123".  All changes should be made on that branch with frequent commits.  Once the feature or bug-fix is ready, make a pull request back to master to merge it in.  Avoid developing directly on `master`.

Version Numbering
-----------------

Releases are tagged via [Semantic Versioning](http://semver.org) (ie. "vMajor.Minor.Patch").  Major is incremented when significant, backwards incompatible changes are made.  Minor is updated with feature releases.  Patch is incremented when bugs are fixed.  For release testing, add "-betaN" to the send of this string.  For example, "v1.2.0-beta2" tag would be the second pre-release test of the first release of new features after v1.1.0. The name of the app is prepended, so "topics-v1.2.0" would be that release of the Topic Manager application.  Not every app gets released at each version increment.

Release Branches
----------------

We branch from `master` for new Minor releases.  These branches are named like `v1.2.x`.  The first tag on that branch would be a tag for "v1.2.0".  As soon as a release is tagged, a pull request should be made back to `master`.  Avoid pulling from master into a release branch.  It is ok to develop directly on the release branch, but only for small bug fixes.
