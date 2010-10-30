DRAW•COMIC
===========

* REQUIREMENTS
* USE CASES
* IMPLEMENTATION PLAN
* RAPID PROTOTYPING

##Requirements
1. Draw bitmaps (+colors, +eraser, +undo)
2. Import images (`/(jpe?g|png|gif|bmp)/ig`)
3. Add objects like text (+fonts, +bubbles)
4. Save on server
5. Export PDF (+multipage)

##Use Cases
###`User` actions:
1. Draw bitmaps
2. Import images
3. Add objects like text
4. Save on server
5. Export PDF
6. View imported files
7. View saved projects

NoSQL - NoSchema Object (JSON) store (Database: [CouchDB][couchone])
------------------------------------

    [
      { "_id":"ABC123",
        "users":[/*list of user _ids*/],
        "_attachments":[/*uploaded images*/],
        "project":"Project Name",
        "pages":[
                  "artboards":[
                                {
                                  "bitmap":"{base64}",
                                  "objects":[
                                              {
                                                "x":123,
                                                "y":123,
                                                "width":123,
                                                "height":123,
                                                "text":"abc",
                                                "direction":"(UP|RIGHT|DOWN|LEFT)"
                                              },
                                              ...
                                            ]
                                },
                                ...
                              ],
                    ...
                ],
        
      },
      ...
    ]

[couchone]: "http://couchone.com/"