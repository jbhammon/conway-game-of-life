initGame = () => {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.canvas.width = window.innerWidth;
  let grid_width = Math.ceil(ctx.canvas.width/15);
  let grid_height = Math.ceil(ctx.canvas.height/15);
  let state = new Array(grid_width*grid_height).fill(0);

  return {
    state: state,
    grid_width: grid_width,
    grid_height: grid_height,
  }

}

setInitialState = game => {

  // Create a Beacon
  let x_index = 3;
  let y_index = 3;
  let flat_index = x_index + (game.grid_width * y_index);
  game.state[flat_index] = 1;
  game.state[flat_index + 1] = 1;
  game.state[flat_index + game.grid_width] = 1;

  game.state[flat_index + (2*game.grid_width) + 3] = 1;
  game.state[flat_index + (3*game.grid_width) + 2] = 1;
  game.state[flat_index + (3*game.grid_width) + 3] = 1;

  // Create a Blinker
  x_index = 2;
  y_index = 10;
  flat_index = x_index + (game.grid_width * y_index);
  game.state[flat_index] = 1;
  game.state[flat_index + 1] = 1;
  game.state[flat_index + 2] = 1;

  // Create a Glider
  x_index = 12;
  y_index = 4;
  flat_index = x_index + (game.grid_width * y_index);
  game.state[flat_index] = 1;
  game.state[flat_index + game.grid_width + 1] = 1;
  game.state[flat_index + game.grid_width + 2] = 1;
  game.state[flat_index + (2*game.grid_width)] = 1;
  game.state[flat_index + (2*game.grid_width + 1)] = 1;

  return game;
}

drawIteration = game => {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.clearRect(0 , 0, ctx.canvas.width, ctx.canvas.height);

  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  
  ctx.beginPath();
  ctx.fillStyle = "#e0e0e0";
  let x_coord = 5;
  let x_index = 0;
  for (x_coord; x_coord < viewportWidth-10; x_coord+=15) {
    let y_coord = 5;
    let y_index = 0;
    for (y_coord; y_coord < viewportHeight-10; y_coord+=15) {
      const flat_index = x_index + (game.grid_width * y_index);
      if (!game.state[flat_index]) {
        ctx.rect(x_coord, y_coord, 10, 10);
      }
      y_index += 1;
    }
    x_index += 1;
  }
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#313131";
  x_coord = 5;
  x_index = 0;
  for (x_coord; x_coord < viewportWidth-10; x_coord+=15) {
    let y_coord = 5;
    let y_index = 0;
    for (y_coord; y_coord < viewportHeight-10; y_coord+=15) {
      const flat_index = x_index + (game.grid_width * y_index);
      if (game.state[flat_index]) {
        ctx.rect(x_coord, y_coord, 10, 10);
      }
      y_index += 1;
    }
    x_index += 1;
  }
  ctx.fill();
}

createNextGeneration = game => {
  let nextState = new Array(game.state.length).fill(0);
  // for every cell
  for (i = 0; i < game.state.length; i++) {
    let x_index = i % game.grid_width;
    let y_index = Math.floor(i / game.grid_width);

    // count alive neighbors
    let count = 0;
    let neighbor_x_index = 0;
    let neighbor_y_index = 0;
    let neighbor_flat_index = 0;

    // top left
    neighbor_x_index = x_index - 1;
    if (neighbor_x_index < 0) {
      neighbor_x_index = game.grid_width - 1;
    }
    neighbor_y_index = y_index - 1;
    if (neighbor_y_index < 0) {
      neighbor_y_index = game.grid_height - 1;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // top
    neighbor_x_index = x_index;
    neighbor_y_index = y_index - 1;
    if (neighbor_y_index < 0) {
      neighbor_y_index = game.grid_height - 1;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // top right
    neighbor_x_index = x_index + 1;
    if (neighbor_x_index === game.grid_width) {
      neighbor_x_index = 0;
    }
    neighbor_y_index = y_index - 1;
    if (neighbor_y_index < 0) {
      neighbor_y_index = game.grid_height - 1;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // left
    neighbor_x_index = x_index - 1;
    if (neighbor_x_index < 0) {
      neighbor_x_index = game.grid_width - 1;
    }
    neighbor_y_index = y_index;
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // right
    neighbor_x_index = x_index + 1;
    if (neighbor_x_index === game.grid_width) {
      neighbor_x_index = 0;
    }
    neighbor_y_index = y_index;
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // bottom left
    neighbor_x_index = x_index - 1;
    if (neighbor_x_index < 0) {
      neighbor_x_index = game.grid_width - 1;
    }
    neighbor_y_index = y_index + 1;
    if (neighbor_y_index === game.grid_height) {
      neighbor_y_index = 0;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // bottom
    neighbor_x_index = x_index;
    neighbor_y_index = y_index + 1;
    if (neighbor_y_index === game.grid_height) {
      neighbor_y_index = 0;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // bottom right
    neighbor_x_index = x_index + 1;
    if (neighbor_x_index === game.grid_width) {
      neighbor_x_index = 0;
    }
    neighbor_y_index = y_index + 1;
    if (neighbor_y_index === game.grid_height) {
      neighbor_y_index = 0;
    }
    neighbor_flat_index = neighbor_x_index + (game.grid_width * neighbor_y_index);
    count += game.state[neighbor_flat_index];

    // if cell is alive
    if (game.state[i]) {
      // if neighbors are two or three
      if (count === 2 || count === 3) {
        nextState[i] = 1;
      } else {
        nextState[i] = 0;
      }
    } else {
      if (count === 3) {
        nextState[i] = 1;
      }
    }
  }

  game.state = nextState;
  return game;
}

runGame = game => {
  // draw the current state
  drawIteration(game);

  // update for the next iteration
  game = createNextGeneration(game);

  // window.requestAnimationFrame(() => {runGame(game)});
  window.setTimeout(() => {runGame(game)}, 125);
}

// Create game
let game = initGame();
// Setup initial state of Life
game = setInitialState(game);
// Start updating
runGame(game);