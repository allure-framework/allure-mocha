describe("Hooks tests", function() {
    describe("broken teardown", function() {
        beforeEach(function() {});
        it("a test", function() {});
        it("a second test", function() {});

        afterEach("broken afterEach", function() {
            throw new Error("I am broken");
        });
    });

    describe("broken setup", function() {
        beforeEach(function() {
            throw new Error("You shall not pass");
        });

        it("a test", function() {});
    });

    afterEach("passing afterEach", function() {});
});
