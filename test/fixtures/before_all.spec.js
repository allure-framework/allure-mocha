describe("Before all tests", function() {

    describe("broken before", function() {
        before(function() {
            throw new Error("you broke the before hook");
        });

        it("a test", function() {});
    });

    describe("before not broken", function() {
        before(function() {});
        it("a test", function() {});
    });

});
