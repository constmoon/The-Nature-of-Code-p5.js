// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(0, -2);
    this.position = createVector(x, y);
    this.r = 6;
    this.maxspeed = 8;
    this.maxforce = 0.2;
  }

  update() {
    // 속도 갱신
    this.velocity.add(this.acceleration);
    // 속도 제한
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // 매 사이클마다 가속도를 0으로 설정
    this.acceleration.mult(0);
  }

  applyForce(force) {
    // A = F / M
    this.acceleration.add(force);
  }

  // 타겟을 향한 조항력(steering force) 계산
  seek(target) {

    // 현재 위치에서 타겟으로 향하는 벡터 구하기
    var desired = p5.Vector.sub(target, this.position);

    // 원하는 속도 크기를 최대 속력으로 설정
    desired.setMag(this.maxspeed);

    // 조항력(Steering) = 원하는 속도 - 현재 속도
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // 최대 조항력을 제한

    this.applyForce(steer);
  }

  display() {
    var theta = this.velocity.heading() + PI / 2;
    fill(127);
    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }
}