import Model from './Model';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Model', () => {
  let model;

  describe('#constructor()', () => {
    it('is Function', () => {
      expect(Model).to.be.instanceOf(Function);
    });
    it('returns instance of Model if use as `new Model()`', () => {
      expect(new Model()).to.be.instanceOf(Model);
    });
    it('throws Error if use as `Model()`', () => {
      expect(Model).to.throw();
    });
  });

  describe('#clone()', () => {
    beforeEach(() => {
      model = new Model({ a: 2 });
    });
    it('returns Model instance', () => {
      expect(model.clone()).to.be.instanceOf(Model);
    });
    it('returns another instance of Model', () => {
      expect(model.clone()).not.to.be.equal(model);
    });
    it('returns deep equal instance of Model', () => {
      expect(model.clone()).to.be.deep.equal(model);
    });
  });

  describe('#set(field, value)', () => {
    let middleware;
    const field = 'field';
    beforeEach(() => {
      model = new Model({});
      middleware = sinon.spy();
      model.addMiddleware(field, middleware);
    });
    it('returns current instance of Model', () => {
      expect(model.set(field, 123)).to.be.equal(model);
    });
    it('calls middleware', () => {
      model.set(field, 11);
      expect(middleware).to.have.been.called;
    });
    it('calls middleware current model as context', () => {
      const newValue = 'new value';
      model.set(field, newValue);
      expect(middleware).to.have.been.calledOn(model);
    });
    it('calls middleware with new value as 1st argument', () => {
      const newValue = 'new value';
      model.set(field, newValue);
      expect(middleware).to.have.been.calledWith(newValue);
    });
    it('calls middleware with new value and all rest arguments', () => {
      const newValue = {};
      model.set(field, newValue, 1, 2, 3, 4, 5, 6);
      expect(middleware).to.have.been.calledWith(newValue, 1, 2, 3, 4, 5, 6);
    });
    it('calls multiple middlewares', () => {
      const secondMiddleware = sinon.spy();

      model.addMiddleware(field, secondMiddleware);
      model.set(field, {});

      expect(middleware).to.have.been.called;
      expect(secondMiddleware).to.have.been.called;
    });
    it('calls next middleware with previous returned statement', () => {
      const nextVal = {};
      const nextMiddleware = value => nextVal;
      model.removeMiddleware(field, middleware)
        .addMiddleware(field, nextMiddleware)
        .addMiddleware(field, middleware);

      model.set(field);
      expect(middleware).to.have.been.calledWith(nextVal);
    });
    it('calls middlewares in order they added', () => {
      const second = sinon.spy();
      model.addMiddleware(field, second);
      model.set(field);
      expect(second).to.be.calledAfter(middleware);
    });
    it('calls every middleware only once', () => {
      model.set(field);
      expect(middleware).to.been.calledOnce;
    });
    it('allows add 1 middleware more than 1 time', () => {
      model.addMiddleware(field, middleware);
      model.set(field);
      expect(middleware).to.been.calledTwice;
    });
    xit('calls all middlewares if some throw error', function (done) {
      const errorMessage = 'my error. all is ok';
      const secondMiddleware = sinon.spy();

      this.middlewareErr = function (err) {
        expect(middleware).to.have.been.called;
        expect(secondMiddleware).to.have.been.called;
        expect(err.message).to.be.equal(errorMessage);
        done();
      };

      model.addMiddleware('setValue', () => {
        throw Error(errorMessage);
      });
      model.addMiddleware('setValue', secondMiddleware);
      model.setValue({});
    });
  });
});
