describe("Skipped tests", function() {
    it.skip("Skipped by definition");

    it("Skipped in runtime", function() {
        this.skip();
    });
});
