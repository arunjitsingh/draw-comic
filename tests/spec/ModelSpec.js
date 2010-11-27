describe("Page", function() {
  var page;

  beforeEach(function() {
    page = new DC.Page();
  });

  it("should have layers", function() {
    expect(page.layers).toEqual([]);
  });
  
  it("should have objects", function() {
    expect(page.objects).toEqual([]);
  });
  
  describe("with data", function() {
    var data = {
      "objects":[
        {
          "x":123,
          "y":123,
          "width":123,
          "height":123,
          "text":"abc",
        }
      ],
      "layers":[
        {
          "bitmap":"{base64}", // images, flattened artwork
          "x":123,
          "y":123,
          "width":123,
          "height":123
        }
      ]
    };
    beforeEach(function(){
      page = new DC.Page();
      page.populate(data);
    });
    
    it("should populate data", function() {
      expect(page.layers.length).toBeGreaterThan(0);
      expect(page.objects.length).toBeGreaterThan(0);
    });
    
    it("should have layers", function() {
      expect(page.layers).toEqual(data.layers);
    });
    
    it("should have objects", function() {
      expect(page.objects).toEqual(data.objects);
    });
  });
});