  // To start from 1
  enum ResourceType {
    BOOK = 1,
    AUTHOR,
    FILM,
    DIRECTOR,
    PERSON,
  }
  
  console.log(ResourceType.BOOK); // 1 (by default it is 0 indexed)
  console.log(ResourceType.AUTHOR); // 2

//By default, enums are number based – they store string values as numbers. But they can also be strings:
  enum Direction {
    Up = 'Up',
    Right = 'Right',
    Down = 'Down',
    Left = 'Left',
  }
  
  console.log(Direction.Right); // Right
  console.log(Direction.Down); // Down