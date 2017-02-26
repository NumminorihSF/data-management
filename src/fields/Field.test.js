import Field from './Field';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);

describe('Field', () => {
  let field;

  describe('#constructor()', () => {
    it('is Function', () => {
      expect(Field).to.be.instanceOf(Function);
    });
    it('returns instance of Field if use as `new Field()`', () => {
      expect(new Field()).to.be.instanceOf(Field);
    });
    it('throws Error if use as `Field()`', () => {
      expect(Field).to.throw();
    });
  });

  describe('#clone()', () => {
    beforeEach(() => {
      field = new Field({ a: 2 });
    });
    it('returns Field instance', () => {
      expect(field.clone()).to.be.instanceOf(Field);
    });
    it('returns another instance of Field', () => {
      expect(field.clone()).not.to.be.equal(field);
    });
    it('returns deep equal instance of Field', () => {
      expect(field.clone()).to.be.deep.equal(field);
    });
  });

  describe('#setValue(value)', () => {
    let hook;
    beforeEach(() => {
      field = new Field({ a: 2 });
      hook = sinon.spy();
      field.addHook('setValue', hook);
    });
    it('returns current instance of Field', () => {
      expect(field.setValue(123)).to.be.equal(field);
    });
    it('calls hook', () => {
      field.setValue(11);
      expect(hook).to.have.been.called;
    });
    it('calls hook with Field instance and new value as arguments', () => {
      const newValue = 'new value';
      field.setValue(newValue);
      expect(hook).to.have.been.calledWith(field, newValue);
    });

    it('calls multiple hooks', () => {
      const secondHook = sinon.spy();

      field.addHook('setValue', secondHook);
      field.setValue({});

      expect(hook).to.have.been.called;
      expect(secondHook).to.have.been.called;
    });

    xit('calls all hooks if some throw error', function (done) {
      const errorMessage = 'my error. all is ok';
      const secondHook = sinon.spy();

      this.hookErr = function (err) {
        expect(hook).to.have.been.called;
        expect(secondHook).to.have.been.called;
        expect(err.message).to.be.equal(errorMessage);
        done();
      };

      field.addHook('setValue', () => {
        throw Error(errorMessage);
      });
      field.addHook('setValue', secondHook);
      field.setValue({});
    });
  });
});
