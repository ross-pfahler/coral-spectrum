describe('CUI.SelectList', function() {

  describe('visibility', function() {
    var $trigger, $selectList;

    beforeEach(function() {
      var id = CUI.util.getNextId();

      $trigger = $('<button data-toggle="selectlist" ' +
          'data-target="#' + id + '">Show List</button>')
          .appendTo(document.body);

      $selectList = $('<ul id="' + id + '" class="selectlist"/>')
          .appendTo(document.body).selectList();
    });

    afterEach(function() {
      $trigger.remove();
      $selectList.remove();
    });

    describe('visibility through API', function() {
      it('shows/hides when show/hide is called', function() {
        $selectList.selectList('show');
        expect($selectList).to.have.class('visible');
        $selectList.selectList('hide');
        expect($selectList).not.to.have.class('visible');
      });
    });

    describe('visibility through interaction', function() {
      it('shows when trigger is clicked', function() {
        $trigger.trigger('click');
        expect($selectList).to.have.class('visible');
      });

      it('hides when trigger is clicked', function() {
        $selectList.selectList('show');
        $trigger.trigger('click');
        expect($selectList).not.to.have.class('visible');
      });

      it('hides on click outside', function() {
        $selectList.selectList('show');
        $(document.body).trigger('click');
        expect($selectList).not.to.have.class('visible');
      });

      it('does not hide when clicking inside list', function() {
        $selectList.selectList('show');
        $selectList.trigger('click');
        expect($selectList).to.have.class('visible');
      });
    });
  });
});

