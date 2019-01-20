// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// The "Vehicle" class

class Vehicle {
  constructor(x, y, ms, mf) {
    this.position = createVector(x, y);
    this.acceleration = createVector(0, 0);
    this.velocity = createVector(2, 0);
    this.r = 4;
    this.maxspeed = ms || 4;
    this.maxforce = mf || 0.1;
  }

  run() {
    this.update();
    this.display();
  }

  // This function implements Craig Reynolds' path following algorithm
  // http://www.red3d.com/cwr/steer/PathFollow.html
  follow(p) {

    // 1. 차량의 미래 위치를 예측한다
    // 1.1 현재 속도를 복사하여 예측값(predict)에 넣어줌
    let predict = this.velocity.copy();
    predict.normalize();
    predict.mult(50);

    // 1.2 현재 위치에 predict 벡터를 더해 미래 위치를 예측
    let predictLoc = p5.Vector.add(this.position, predict);

    // 2. 경로 위의 법선 점을 구한다
    let a = p.start;
    let b = p.end;
    let normalPoint = getNormalPoint(predictLoc, a, b);

    //  3. 경로보다 조금 앞에 있는 점을 구한 후, 타겟으로 설정한다.
    // (법선 점보다 10픽셀 정도 앞에 있는 점을 목표로 한다)
    let dir = p5.Vector.sub(b, a);
    dir.normalize();
    dir.mult(10); 
    let target = p5.Vector.add(normalPoint, dir);

    // 4. 경로로부터 벗어난 경우, 경로로 돌아가게 만든다
    let distance = p5.Vector.dist(predictLoc, normalPoint);
    if (distance > p.radius) {
      this.seek(target);
    }


    // Draw the debugging stuff
    if (debug) {
      fill(200);
      stroke(200);
      line(this.position.x, this.position.y, predictLoc.x, predictLoc.y);
      ellipse(predictLoc.x, predictLoc.y, 4, 4);

      // Draw normal location
      fill(200);
      stroke(200);
      line(predictLoc.x, predictLoc.y, normalPoint.x, normalPoint.y);
      ellipse(normalPoint.x, normalPoint.y, 4, 4);
      stroke(200);
      if (distance > p.radius) fill(255, 0, 0);
      noStroke();
      ellipse(target.x + dir.x, target.y + dir.y, 8, 8);
    }
  }


  applyForce(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

  // A method that calculates and applies a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  seek(target) {
    let desired = p5.Vector.sub(target, this.position); // A vector pointing from the position to the target

    // If the magnitude of desired equals 0, skip out of here
    // (We could optimize this to check if x and y are 0 to avoid mag() square root
    if (desired.mag() === 0) return;

    // Normalize desired and scale to maximum speed
    desired.normalize();
    desired.mult(this.maxspeed);
    // Steering = Desired minus Velocity
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce); // Limit to maximum steering force

    this.applyForce(steer);
  }

  // Method to update position
  update() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // Wraparound
  borders(p) {
    if (this.position.x > p.end.x + this.r) {
      this.position.x = p.start.x - this.r;
      this.position.y = p.start.y + (this.position.y - p.end.y);
    }
  }

  display() {
    // Draw a triangle rotated in the direction of velocity
    let theta = this.velocity.heading() + PI / 2;
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

function getNormalPoint(p, a, b) {
  // 시작점부터 예상위치까지
  let ap = p5.Vector.sub(p, a);
  // 시작점부터 끝점까지
  let ab = p5.Vector.sub(b, a);

  // 벡터 정규화 후 내적
  ab.normalize();
  ab.mult(ap.dot(ab));

  // 선분 위의 법선 점을 찾는다
  let normalPoint = p5.Vector.add(a, ab);
  return normalPoint;
}