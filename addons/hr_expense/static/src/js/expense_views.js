odoo.define("hr_expense.expenses.tree", function (require) {
  "use strict"
  var DocumentUploadMixin = require("hr_expense.documents.upload.mixin")
  var KanbanController = require("web.KanbanController")
  var KanbanView = require("web.KanbanView")
  var ListController = require("web.ListController")
  var ListView = require("web.ListView")
  var viewRegistry = require("web.view_registry")
  var core = require("web.core")
  var ListRenderer = require("web.ListRenderer")
  var KanbanRenderer = require("web.KanbanRenderer")
  var session = require("web.session")
  const config = require("web.config")

  var QWeb = core.qweb

  var ExpensesListController = ListController.extend(DocumentUploadMixin, {
    buttons_template: "ExpensesListView.buttons",
    events: _.extend({}, ListController.prototype.events, {
      "click .o_button_upload_expense": "_onUpload",
      "change .o_expense_documents_upload .o_form_binary_form":
        "_onAddAttachment",
    }),
  })

  const ExpenseDashboardMixin = {
    _render: async function () {
      var self = this
      await this._super(...arguments)
      const result = await this._rpc({
        model: "hr.expense",
        method: "get_expense_dashboard",
        context: this.context,
      })

      self.$el.parent().find(".o_expense_container").remove()
      const elem = QWeb.render("hr_expense.dashboard_list_header", {
        expenses: result,
        render_monetary_field: self.render_monetary_field,
      })
      self.$el.before(elem)
    },
    render_monetary_field: function (value, currency_id) {
      value = value.toFixed(2)
      var currency = session.get_currency(currency_id)
      if (currency) {
        if (currency.position === "after") {
          value += currency.symbol
        } else {
          value = currency.symbol + value
        }
      }
      return value
    },
  }

  // Expense List Renderer
  var ExpenseListRenderer = ListRenderer

  // Expense List Renderer with the Header
  // Used in "My Expenses to Report", "All My Expenses" & "My Reports"
  var ExpenseListRendererHeader = ExpenseListRenderer.extend(
    ExpenseDashboardMixin
  )

  var ExpensesListViewDashboardUpload = ListView.extend({
    config: _.extend({}, ListView.prototype.config, {
      Renderer: ExpenseListRenderer,
      Controller: ExpensesListController,
    }),
  })

  // Used in "My Expenses to Report" & "All My Expenses"
  var ExpensesListViewDashboardUploadHeader =
    ExpensesListViewDashboardUpload.extend({
      config: _.extend({}, ExpensesListViewDashboardUpload.prototype.config, {
        Renderer: ExpenseListRendererHeader,
      }),
    })

  // The dashboard view of the expense module
  var ExpensesListViewDashboard = ListView.extend({
    config: _.extend({}, ListView.prototype.config, {
      Renderer: ExpenseListRenderer,
      Controller: ExpensesListController,
    }),
  })

  // The dashboard view of the expense module with an header
  // Used in "My Expenses"
  var ExpensesListViewDashboardHeader = ExpensesListViewDashboard.extend({
    config: _.extend({}, ExpensesListViewDashboard.prototype.config, {
      Renderer: ExpenseListRendererHeader,
    }),
  })

  var ExpensesKanbanController = KanbanController.extend(DocumentUploadMixin, {
    buttons_template: "ExpensesKanbanView.buttons",
    events: _.extend({}, KanbanController.prototype.events, {
      "click .o_button_upload_expense": "_onUpload",
      "change .o_expense_documents_upload .o_form_binary_form":
        "_onAddAttachment",
    }),
  })

  var ExpenseKanbanRenderer = KanbanRenderer

  var ExpenseKanbanRendererHeader = ExpenseKanbanRenderer.extend(
    ExpenseDashboardMixin
  )

  // The kanban view
  var ExpensesKanbanView = KanbanView.extend({
    config: _.extend({}, KanbanView.prototype.config, {
      Controller: ExpensesKanbanController,
      Renderer: ExpenseKanbanRenderer,
    }),
  })

  // The kanban view with the Header
  // Used in "My Expenses to Report", "All My Expenses" & "My Repo
  var ExpensesKanbanViewHeader = ExpensesKanbanView.extend({
    config: _.extend({}, ExpensesKanbanView.prototype.config, {
      Renderer: ExpenseKanbanRendererHeader,
    }),
  })

  viewRegistry.add(
    "hr_expense_tree_dashboard_upload",
    ExpensesListViewDashboardUpload
  )
  // Tree view with the header.
  // Used in "My Expenses to Report" & "All My Expenses"
  viewRegistry.add(
    "hr_expense_tree_dashboard_upload_header",
    ExpensesListViewDashboardUploadHeader
  )
  viewRegistry.add("hr_expense_tree_dashboard", ExpensesListViewDashboard)
  // Tree view with the header.
  // Used in "My Reports"
  viewRegistry.add(
    "hr_expense_tree_dashboard_header",
    ExpensesListViewDashboardHeader
  )
  viewRegistry.add("hr_expense_kanban", ExpensesKanbanView)
  // Kanban view with the header.
  // Used in "My Expenses to Report", "All My Expenses" & "My Reports"
  viewRegistry.add("hr_expense_kanban_header", ExpensesKanbanViewHeader)
})
