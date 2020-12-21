import Sinon from 'sinon'
import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'

let sandbox, config

module('Unit | Integration | google tagmanager', function (hooks) {
  setupTest(hooks)

  hooks.beforeEach(function () {
    sandbox = Sinon.sandbox.create()
    config = {
      id: 'UA-XXXXXXXX-Y'
    }
  })

  hooks.afterEach(function () {
    sandbox.restore()
  })

  test('it can be configured with an id', function (assert) {
    const integration = this.owner.factoryFor('integration:google-tagmanager').create({ config })
    assert.ok(integration)
  })

  test('#trackPage calls gtag with the correct arguments', function (assert) {
    const integration = this.owner.factoryFor('integration:google-tagmanager').create({ config })

    const stub = sandbox.stub(window, 'gtag').callsFake(function () {
      return true
    })

    integration.trackPage({ page: '/', title: '/' })
    assert.ok(stub.calledWith('event', 'page_view', { page_path: '/', page_title: '/' }))
  })

  test('#trackEvent calls gtag with the correct arguments', function (assert) {
    const integration = this.owner.factoryFor('integration:google-tagmanager').create({ config })

    const stub = sandbox.stub(window, 'gtag').callsFake(function () {
      return true
    })

    integration.trackEvent({ category: 'Starships', action: 'Warp', label: 'Enterprise' })

    assert.ok(stub.calledWith('event', {
      hitType: 'event',
      eventCategory: 'Starships',
      eventAction: 'Warp',
      eventLabel: 'Enterprise'
    }))
  })

  test('#trackEvent handles metrics and dimensions correctly', function (assert) {
    const integration = this.owner.factoryFor('integration:google-tagmanager').create({ config })

    const stub = sandbox.stub(window, 'gtag').callsFake(function () {
      return true
    })

    integration.trackEvent({ category: 'Starships', action: 'Warp', dimension1: 'Enterprise', metric1: 'D' })

    assert.ok(stub.calledWith('event', {
      hitType: 'event',
      eventCategory: 'Starships',
      eventAction: 'Warp',
      dimension1: 'Enterprise',
      metric1: 'D'
    }))
  })

  test('#identify calls gtag with the correct arguments', function (assert) {
    const integration = this.owner.factoryFor('integration:google-tagmanager').create({ config })

    const stub = sandbox.stub(window, 'gtag').callsFake(function () {
      return true
    })

    integration.identify({ id: '001' })
    assert.ok(stub.calledWith('set', 'userId', '001'))
  })
})
