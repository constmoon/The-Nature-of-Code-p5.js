// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Path Following

class Path {
  constructor() {
    // 경로의 너비
    this.radius = 20;
    // 경로를 이루는 시작점과 끝점(Vector)
    this.start = createVector(0, height / 3);
    this.end = createVector(width, 2 * height / 3);
  }

  // 경로 출력
  display() {

    strokeWeight(this.radius * 2);
    stroke(200, 100);
    line(this.start.x, this.start.y, this.end.x, this.end.y);

    strokeWeight(1);
    stroke(200);
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}